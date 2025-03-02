import { saveAs } from 'file-saver'

/**
 * Format file size
 * @param size
 */
export const formatSize = (size?: number) => {
  if (size === undefined || size === null) return 'Unknown'
  if (size < 1024) return size + ' B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB'
  return (size / (1024 * 1024)).toFixed(2) + ' MB'
}

/**
 * Download image
 * @param url Image download URL
 * @param fileName File name to save as
 */
export function downloadImage(url?: string, fileName?: string) {
  if (!url) {
    return
  }
  saveAs(url, fileName)
}

export function toHexColor(input: string) {
  // Remove 0x prefix
  const colorValue = input.startsWith('0x') ? input.slice(2) : input

  // Parse the remaining part as a hexadecimal number, then convert to a 6-digit hexadecimal string
  const hexColor = parseInt(colorValue, 16).toString(16).padStart(6, '0')

  // Return standard #RRGGBB format
  return `#${hexColor}`
}

interface EventHandlers {
  [type: string]: Array<EventHandler>
}

interface EventHandler {
  (data?: unknown): void
}

export default class PictureEditWebSocket {
  private pictureId: string
  private socket: WebSocket | null
  private eventHandlers: EventHandlers

  constructor(pictureId: string) {
    this.pictureId = pictureId // Current picture ID being edited
    this.socket = null // WebSocket instance
    this.eventHandlers = {} // Custom event handlers
  }

  /**
   * Initialize WebSocket connection
   */
  connect() {
    const url = `/api/ws/picture/edit?pictureId=${this.pictureId}`
    this.socket = new WebSocket(url)

    // Set to carry cookie
    this.socket.binaryType = 'blob'

    // Listen for connection open event
    this.socket.onopen = () => {
      console.log('WebSocket connection established')
      this.triggerEvent('open')
    }

    // Listen for message event
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      console.log('Message received:', message)

      // Trigger corresponding event based on message type
      const type = message.type
      this.triggerEvent(type, message)
    }

    // Listen for connection close event
    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event)
      this.triggerEvent('close', event)
    }

    // Listen for error event
    this.socket.onerror = (error) => {
      console.error('WebSocket error occurred:', error)
      this.triggerEvent('error', error)
    }
  }

  /**
   * Close WebSocket connection
   */
  disconnect() {
    if (this.socket) {
      this.socket.close()
      console.log('WebSocket connection manually closed')
    }
  }

  /**
   * Send message to backend
   * @param {Object} message Message object
   */
  sendMessage(message: object) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
      console.log('Message sent:', message)
    } else {
      console.error('WebSocket not connected, unable to send message:', message)
    }
  }

  /**
   * Add custom event listener
   * @param {string} type Message type
   * @param {Function} handler Message handler function
   */
  on(type: string, handler: (data?: unknown) => void) {
    if (!this.eventHandlers[type]) {
      this.eventHandlers[type] = []
    }
    this.eventHandlers[type].push(handler)
  }

  /**
   * Trigger event
   * @param {string} type Message type
   * @param {Object} data Message data
   */
  triggerEvent(type: string, data?: unknown) {
    const handlers = this.eventHandlers[type]
    if (handlers) {
      handlers.forEach((handler: EventHandler) => handler(data))
    }
  }
}
