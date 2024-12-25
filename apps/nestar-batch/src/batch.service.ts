import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
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