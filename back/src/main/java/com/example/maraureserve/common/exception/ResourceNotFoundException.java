package com.example.maraureserve.common.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " com id " + id + " não foi encontrado.");
    }
}
