declare module 'zkteco-js' {
  type User = {
    id: number;
    name: string;
    password: string;
    privilege: number;
    enabled: boolean;
  };

  type ZKLibOptions = {
    port?: number;
    timeout?: number;
    retry?: number;
  };

  class ZKLib {
    constructor(ip: string, port?: number, timeout?: number, retry?: number);

    createSocket(): Promise<void>;
    getUsers(): Promise<User[]>;
    getAttendances(): Promise<any[]>;
    getAttendanceSize(): Promise<number>;
    disconnect(): Promise<void>;
  }

  export default ZKLib;
}
