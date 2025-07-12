// src/core/errors.ts
export enum ErrorCode {
  PluginLoadFailed = 'PLUGIN_LOAD_FAILED',
  PluginActivationFailed = 'PLUGIN_ACTIVATION_FAILED',
  BufferOperationFailed = 'BUFFER_OPERATION_FAILED',
  UnknownError = 'UNKNOWN_ERROR',
}

export class EditorError extends Error {
  public readonly code: ErrorCode;
  public readonly originalError?: Error;

  constructor(message: string, code: ErrorCode, originalError?: Error) {
    super(message);
    this.name = 'EditorError';
    this.code = code;
    this.originalError = originalError;
  }
}
