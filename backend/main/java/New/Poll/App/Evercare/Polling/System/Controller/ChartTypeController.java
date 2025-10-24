package New.Poll.App.Evercare.Polling.System.Controller;

import New.Poll.App.Evercare.Polling.System.DTO.ChartTypeDto;
import New.Poll.App.Evercare.Polling.System.Service.ChartTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/chart-types")
public class ChartTypeController {

    @Autowired
    private ChartTypeService chartTypeService;

    @GetMapping
    public ResponseEntity<List<ChartTypeDto>> getAllChartTypes() {
        List<ChartTypeDto> chartTypes = chartTypeService.getAllChartTypes();
        return ResponseEntity.ok(chartTypes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChartTypeDto> getChartTypeById(@PathVariable Long id) {
        ChartTypeDto chartType = chartTypeService.getChartTypeById(id);
        return ResponseEntity.ok(chartType);
    }
}