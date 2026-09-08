package com.uv.app.dto.response;

import java.time.OffsetDateTime;

public record ErrorResponse(
        int status,
        String message,
        String code,
        OffsetDateTime timestamp
) {
}