import { PartialType } from '@nestjs/swagger';
import { CreateQuoteDto } from './create-quote.dto.js';

export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
