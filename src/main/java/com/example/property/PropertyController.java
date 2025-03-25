package com.example.property;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    // POST para crear una nueva propiedad
    
    public String requestMethodName(@RequestParam String param) {
        return new String();
    }
    
    @RequestMapping(method=RequestMethod.POST)
    public Property createProperty(@RequestBody Property property) {
        return propertyRepository.save(property);
    }

    // GET para recuperar todas las propiedades
    @GetMapping
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    // GET para recuperar una sola propiedad por ID
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        return property.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT para actualizar una propiedad existente
    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property propertyDetails) {
        Optional<Property> property = propertyRepository.findById(id);
        if (property.isPresent()) {
            Property updatedProperty = property.get();
            updatedProperty.setAddress(propertyDetails.getAddress());
            updatedProperty.setPrice(propertyDetails.getPrice());
            updatedProperty.setSize(propertyDetails.getSize());
            updatedProperty.setDescription(propertyDetails.getDescription());
            propertyRepository.save(updatedProperty);
            return ResponseEntity.ok(updatedProperty);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE para eliminar una propiedad por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        if (property.isPresent()) {
            propertyRepository.delete(property.get());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
