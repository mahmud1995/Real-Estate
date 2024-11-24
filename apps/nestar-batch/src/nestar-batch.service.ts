import { Injectable } from '@nestjs/common';

@Injectable()
export class NestarBatchService {
  getHello(): string {
    return 'Hello Nestar!';
  }
}


/*
import { Controller, GET } from "@nestjs/common"


@Controller()
export class AppController {



}



*/