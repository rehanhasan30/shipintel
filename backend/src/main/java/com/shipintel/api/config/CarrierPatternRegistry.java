package com.shipintel.api.config;

import java.util.List;
import java.util.regex.Pattern;

public class CarrierPatternRegistry {

    public record CarrierPattern(
        String carrier,
        Pattern pattern
    ) {}

    public static final List<CarrierPattern> REGISTRY = List.of(
        new CarrierPattern("Delhivery", Pattern.compile("^(?:[0-9]{12}|[0-9]{10}|DL[0-9]{9}IN)$")),
        new CarrierPattern("Blue Dart", Pattern.compile("^[0-9]{8,11}$")),
        new CarrierPattern("DTDC", Pattern.compile("^[A-Z][0-9]{8}$")),
        new CarrierPattern("India Post", Pattern.compile("^[A-Z]{2}[0-9]{9}[A-Z]{2}$")),
        new CarrierPattern("XpressBees", Pattern.compile("^(?:[0-9]{14}|XB[0-9]{10})$"))
    );
}
