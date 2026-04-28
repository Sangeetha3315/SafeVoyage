"use client"

export interface BlockchainRecord {
  id: string
  timestamp: Date
  userId: string
  alertId: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  hash: string
  previousHash: string
  nonce: number
  isEditable: boolean
  editHistory: BlockchainEdit[]
}

export interface BlockchainEdit {
  timestamp: Date
  editedBy: string
  changes: string
  newHash: string
}

export class BlockchainService {
  private static readonly BLOCKCHAIN_KEY = "safetour_blockchain_records"

  // Generate a unique blockchain ID
  static generateBlockchainId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `BLK-${timestamp.toString(36).toUpperCase()}-${random}`
  }

  // Simple hash function (in production, use proper cryptographic hash)
  private static simpleHash(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, "0").toUpperCase()
  }

  // Create a new blockchain record for SOS alert
  static createSOSRecord(
    userId: string,
    alertId: string,
    location: { latitude: number; longitude: number; address?: string },
    message: string,
  ): BlockchainRecord {
    const records = this.getBlockchainRecords()
    const previousHash = records.length > 0 ? records[records.length - 1].hash : "0000000000000000"

    const timestamp = new Date()
    const data = `${userId}:${alertId}:${location.latitude}:${location.longitude}:${message}:${timestamp.toISOString()}`

    // Simple proof of work (find nonce that makes hash start with zeros)
    let nonce = 0
    let hash = ""
    do {
      nonce++
      const blockData = `${data}:${previousHash}:${nonce}`
      hash = this.simpleHash(blockData)
    } while (!hash.startsWith("00")) // Require hash to start with "00"

    const record: BlockchainRecord = {
      id: this.generateBlockchainId(),
      timestamp,
      userId,
      alertId,
      location,
      hash,
      previousHash,
      nonce,
      isEditable: true, // Allow editing for first 24 hours
      editHistory: [],
    }

    records.push(record)
    this.saveBlockchainRecords(records)

    // Make record non-editable after 24 hours
    setTimeout(
      () => {
        this.lockRecord(record.id)
      },
      24 * 60 * 60 * 1000,
    )

    return record
  }

  // Edit a blockchain record (if still editable)
  static editRecord(
    recordId: string,
    editedBy: string,
    changes: string,
    newData: Partial<Pick<BlockchainRecord, "location">>,
  ): boolean {
    const records = this.getBlockchainRecords()
    const recordIndex = records.findIndex((r) => r.id === recordId)

    if (recordIndex === -1) return false

    const record = records[recordIndex]

    // Check if record is still editable
    const hoursSinceCreation = (Date.now() - record.timestamp.getTime()) / (1000 * 60 * 60)
    if (!record.isEditable || hoursSinceCreation > 24) {
      return false
    }

    // Create edit history entry
    const edit: BlockchainEdit = {
      timestamp: new Date(),
      editedBy,
      changes,
      newHash: "",
    }

    // Update record data
    if (newData.location) {
      record.location = { ...record.location, ...newData.location }
    }

    // Recalculate hash with new data
    const data = `${record.userId}:${record.alertId}:${record.location.latitude}:${record.location.longitude}:EDITED:${edit.timestamp.toISOString()}`
    const blockData = `${data}:${record.previousHash}:${record.nonce}`
    const newHash = this.simpleHash(blockData)

    edit.newHash = newHash
    record.hash = newHash
    record.editHistory.push(edit)

    records[recordIndex] = record
    this.saveBlockchainRecords(records)

    return true
  }

  // Lock a record (make it non-editable)
  private static lockRecord(recordId: string): void {
    const records = this.getBlockchainRecords()
    const recordIndex = records.findIndex((r) => r.id === recordId)

    if (recordIndex !== -1) {
      records[recordIndex].isEditable = false
      this.saveBlockchainRecords(records)
    }
  }

  // Verify blockchain integrity
  static verifyBlockchain(): { isValid: boolean; errors: string[] } {
    const records = this.getBlockchainRecords()
    const errors: string[] = []

    for (let i = 0; i < records.length; i++) {
      const record = records[i]

      // Verify hash
      const data = `${record.userId}:${record.alertId}:${record.location.latitude}:${record.location.longitude}:${record.editHistory.length > 0 ? "EDITED" : "ORIGINAL"}:${record.timestamp.toISOString()}`
      const blockData = `${data}:${record.previousHash}:${record.nonce}`
      const calculatedHash = this.simpleHash(blockData)

      if (calculatedHash !== record.hash) {
        errors.push(`Invalid hash for record ${record.id}`)
      }

      // Verify chain linkage
      if (i > 0 && record.previousHash !== records[i - 1].hash) {
        errors.push(`Broken chain at record ${record.id}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  // Get all blockchain records
  static getBlockchainRecords(): BlockchainRecord[] {
    if (typeof window === "undefined") return []
    const records = localStorage.getItem(this.BLOCKCHAIN_KEY)
    return records
      ? JSON.parse(records).map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp),
          editHistory: r.editHistory.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp),
          })),
        }))
      : []
  }

  // Save blockchain records
  private static saveBlockchainRecords(records: BlockchainRecord[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.BLOCKCHAIN_KEY, JSON.stringify(records))
  }

  // Get record by ID
  static getRecord(recordId: string): BlockchainRecord | null {
    const records = this.getBlockchainRecords()
    return records.find((r) => r.id === recordId) || null
  }

  // Get records by user ID
  static getRecordsByUser(userId: string): BlockchainRecord[] {
    const records = this.getBlockchainRecords()
    return records.filter((r) => r.userId === userId)
  }

  // Get records by alert ID
  static getRecordByAlert(alertId: string): BlockchainRecord | null {
    const records = this.getBlockchainRecords()
    return records.find((r) => r.alertId === alertId) || null
  }
}
