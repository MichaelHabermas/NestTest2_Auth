import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
    @ApiProperty() // makes visible to Swagger
    title: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty()
    body: string;

    @ApiProperty({ required: false, default: false })
    published?: boolean = false;
}
