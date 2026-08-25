package com.uv.app.controller;

import com.uv.app.service.MasterDataService;
import com.uv.generated.app.api.MastersApiController;
import com.uv.generated.app.model.MasterCatalogResponse;
import com.uv.generated.app.model.MasterGroupResponse;
import com.uv.generated.app.model.MasterSeedResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

@RestController
@Slf4j
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://10.169.144.244:3000"
})
public class MastersController extends MastersApiController {

    private final MasterDataService masterDataService;

    public MastersController(NativeWebRequest request, MasterDataService masterDataService) {
        super(request);
        this.masterDataService = masterDataService;
    }

    @Override
    public ResponseEntity<MasterCatalogResponse> getMasters() {
        log.info("Received request to get all master data");
        return ResponseEntity.ok(masterDataService.getMasters());
    }

    @Override
    public ResponseEntity<MasterGroupResponse> getMastersByGroup(String groupCode) {
        log.info("Received request to get master data for group {}", groupCode);
        return ResponseEntity.ok(masterDataService.getMastersByGroup(groupCode));
    }

    @Override
    public ResponseEntity<MasterSeedResponse> seedMasters() {
        log.info("Received request to seed master data");
        return ResponseEntity.ok(masterDataService.seedMasters());
    }
}
