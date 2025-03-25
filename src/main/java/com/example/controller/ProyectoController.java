package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ProyectoController {

    @GetMapping("/register-plate")
    public String registerPlate() {
        return "redirect:/register-plate.html";
    }
}
