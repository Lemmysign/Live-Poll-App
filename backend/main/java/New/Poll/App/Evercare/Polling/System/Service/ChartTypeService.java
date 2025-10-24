package New.Poll.App.Evercare.Polling.System.Service;

import New.Poll.App.Evercare.Polling.System.DTO.ChartTypeDto;

import java.util.List;

public interface ChartTypeService {
    List<ChartTypeDto> getAllChartTypes();
    ChartTypeDto getChartTypeById(Long id);
}