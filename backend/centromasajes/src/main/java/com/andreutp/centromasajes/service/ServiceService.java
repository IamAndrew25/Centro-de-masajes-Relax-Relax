package com.andreutp.centromasajes.service;

import com.andreutp.centromasajes.dao.IServiceRepository;
import com.andreutp.centromasajes.model.ServiceModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

    @Autowired
    private final IServiceRepository iServiceRepository;

    public ServiceService(IServiceRepository iServiceRepository) {
        this.iServiceRepository = iServiceRepository;
    }

    //crear servicio masaje ANADIR EXCEPTION
    public ServiceModel saveModelService(ServiceModel service){


        return this.iServiceRepository.save(service);
    }

    //listar todos los masajes
    public List<ServiceModel> getAllService(){
        return iServiceRepository.findAll();
    }
    //CREAR UN METODO OBTENER POR NOMBRE EL SERVICIO


    //buscar por id
    public ServiceModel getServiceById(Long id){
        return iServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("no se encontro el servicio"));
    }

    //ACTUALIZAR
    public ServiceModel updateService(Long id, ServiceModel newServiceModel){
        ServiceModel newservice = getServiceById(id);

        newservice.setName(newServiceModel.getName());
        newservice.setDescription(newServiceModel.getDescription());
        newservice.setDurationMin(newServiceModel.getDurationMin());
        newservice.setBaseprice(newServiceModel.getBaseprice());
        newservice.setActive(newServiceModel.getActive());

        return iServiceRepository.save(newservice);
    }

    //eliminar
    public void deleteService(Long id){
        iServiceRepository.deleteById(id);
    }

}