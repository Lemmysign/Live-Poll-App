package New.Poll.App.Evercare.Polling.System.ServiceImpl;

import New.Poll.App.Evercare.Polling.System.Repository.ChartTypeRepository;
import New.Poll.App.Evercare.Polling.System.Service.ChartTypeService;
import New.Poll.App.Evercare.Polling.System.DTO.ChartTypeDto;
import New.Poll.App.Evercare.Polling.System.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChartTypeServiceImpl implements ChartTypeService {

    @Autowired
    private ChartTypeRepository chartTypeRepository;

    @Override
    public List<ChartTypeDto> getAllChartTypes() {
        return chartTypeRepository.findAll().stream()
                .map(chartType -> new ChartTypeDto(chartType.getId(), chartType.getName(), chartType.getDescription()))
                .collect(Collectors.toList());
    }

    @Override
    public ChartTypeDto getChartTypeById(Long id) {
        return chartTypeRepository.findById(id)
                .map(chartType -> new ChartTypeDto(chartType.getId(), chartType.getName(), chartType.getDescription()))
                .orElseThrow(() -> new ResourceNotFoundException("Chart Type not found with id: " + id));
    }
}