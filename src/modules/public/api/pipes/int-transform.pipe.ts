import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IntTransformPipe implements PipeTransform<any, number> {
  transform(value: any, metadata: ArgumentMetadata): number {
    const result = Number(value);
    if (isNaN(result)) throw new NotFoundException();
    return result;
  }
}
