import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getVersion(): object {
    return {
      version: 'v1',
    };
  }
}
