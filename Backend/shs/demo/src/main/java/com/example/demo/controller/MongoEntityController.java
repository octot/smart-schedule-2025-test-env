package com.example.demo.controller;

import com.example.demo.service.MongoEntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

public class MongoEntityController<T, ID> {

    protected final MongoEntityService<T, ID> service;

    protected MongoEntityController(MongoEntityService<T, ID> service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<T> create(@RequestBody T entity) {
        T createdEntity = service.create(entity);
        return ResponseEntity.ok(createdEntity);
    }

    @GetMapping
    public ResponseEntity<List<T>> getAll() {
        List<T> entities = service.getAll();
        return ResponseEntity.ok(entities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable ID id) {
        Optional<T> entity = service.getById(id);
        return entity
                .map(e -> ResponseEntity.ok((Object) e))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable ID id, @RequestBody T entity) {
        Optional<T> updatedEntity = service.update(id, entity);
        return updatedEntity.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable ID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
