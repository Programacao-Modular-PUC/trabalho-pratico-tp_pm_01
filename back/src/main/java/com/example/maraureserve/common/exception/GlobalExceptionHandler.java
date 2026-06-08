package com.example.maraureserve.common.exception;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
        problemDetail.setTitle("Recurso não encontrado");
        problemDetail.setType(URI.create("https://maraureserve.dev/errors/not-found"));
        return problemDetail;
    }

    @ExceptionHandler(DataInvalidaException.class)
    public ProblemDetail handleDataInvalida(DataInvalidaException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
        problemDetail.setTitle("Data invalida");
        problemDetail.setType(URI.create("https://maraureserve.dev/errors/invalid-date"));
        return problemDetail;
    }

    @ExceptionHandler(QuartoIndisponivelException.class)
    public ProblemDetail handleQuartoIndisponivel(QuartoIndisponivelException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, exception.getMessage());
        problemDetail.setTitle("Quarto indisponivel");
        problemDetail.setType(URI.create("https://maraureserve.dev/errors/unavailable-room"));
        return problemDetail;
    }

    @ExceptionHandler(BusinessException.class)
    public ProblemDetail handleBusinessException(BusinessException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getMessage());
        problemDetail.setTitle("Regra de negócio inválida");
        problemDetail.setType(URI.create("https://maraureserve.dev/errors/business"));
        return problemDetail;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidationException(MethodArgumentNotValidException exception) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Existem campos inválidos na requisição.");
        problemDetail.setTitle("Falha de validação");
        problemDetail.setType(URI.create("https://maraureserve.dev/errors/validation"));

        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        problemDetail.setProperty("errors", fieldErrors);
        return problemDetail;
    }
}
