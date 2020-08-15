import { ExceptionFilter, HttpException, ArgumentsHost } from "@nestjs/common";
export declare class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
