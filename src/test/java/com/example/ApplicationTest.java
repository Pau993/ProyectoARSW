package com.example;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.property.Property;
import com.example.property.PropertyRepository;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PropertyRepository propertyRepository;

    @Test
    public void testCreateProperty() throws Exception {
        String propertyJson = "{\"address\":\"123 Main St\",\"price\":250000.0,\"size\":1500.0,\"description\":\"Beautiful house\"}";

        mockMvc.perform(MockMvcRequestBuilders.post("/properties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(propertyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("123 Main St"))
                .andExpect(jsonPath("$.price").value(250000.0))
                .andExpect(jsonPath("$.size").value(1500.0))
                .andExpect(jsonPath("$.description").value("Beautiful house"));
    }

    @Test
    public void testGetPropertyById() throws Exception {
        Property property = new Property();
        property.setAddress("123 Main St");
        property.setPrice(250000);
        property.setSize(1500);
        property.setDescription("Beautiful house");
        property = propertyRepository.save(property);

        mockMvc.perform(MockMvcRequestBuilders.get("/properties/" + property.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("123 Main St"))
                .andExpect(jsonPath("$.price").value(250000.0))
                .andExpect(jsonPath("$.size").value(1500.0))
                .andExpect(jsonPath("$.description").value("Beautiful house"));
    }

    @Test
    public void testUpdateProperty() throws Exception {
        Property property = new Property();
        property.setAddress("123 Main St");
        property.setPrice(250000);
        property.setSize(1500);
        property.setDescription("Beautiful house");
        property = propertyRepository.save(property);

        String updatedPropertyJson = "{\"address\":\"456 Elm St\",\"price\":300000.0,\"size\":2000.0,\"description\":\"Updated house\"}";

        mockMvc.perform(MockMvcRequestBuilders.put("/properties/" + property.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(updatedPropertyJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.address").value("456 Elm St"))
                .andExpect(jsonPath("$.price").value(300000.0))
                .andExpect(jsonPath("$.size").value(2000.0))
                .andExpect(jsonPath("$.description").value("Updated house"));
    }

    @Test
    public void testDeleteProperty() throws Exception {
        Property property = new Property();
        property.setAddress("123 Main St");
        property.setPrice(250000);
        property.setSize(1500);
        property.setDescription("Beautiful house");
        property = propertyRepository.save(property);

        mockMvc.perform(MockMvcRequestBuilders.delete("/properties/" + property.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}