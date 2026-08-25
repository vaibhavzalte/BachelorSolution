package com.uv.app.dto.seed;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MasterSeedGroup {

    private String groupCode;
    private String groupLabel;
    private List<String> data;
}
