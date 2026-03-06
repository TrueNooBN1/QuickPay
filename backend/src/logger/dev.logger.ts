import { Injectable, ConsoleLogger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class DevLogger extends ConsoleLogger {}
