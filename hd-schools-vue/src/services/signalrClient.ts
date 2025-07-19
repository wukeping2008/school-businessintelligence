// SignalR client placeholder
// This file is created to resolve import errors
// Real-time features will be implemented in Phase 2

export interface PerformanceMetrics {
  dataRate: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
}

export class SignalRClient {
  private connected: boolean = false;

  async start(): Promise<void> {
    console.log('SignalR client placeholder - real-time features coming in Phase 2');
    this.connected = true;
  }

  async stop(): Promise<void> {
    this.connected = false;
  }

  onPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void): void {
    // Placeholder - will be implemented with real SignalR
    console.log('Performance update listener registered');
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export default new SignalRClient();