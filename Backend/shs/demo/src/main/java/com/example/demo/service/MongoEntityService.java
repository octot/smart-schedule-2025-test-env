package com.example.demo.service;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public class MongoEntityService<T, ID> {
    protected final MongoRepository<T, ID> repository;

    protected MongoEntityService(MongoRepository<T, ID> repository) {
        this.repository = repository;
    }

    public T create(T entity) {
        return repository.save(entity);
    }

    public List<T> getAll() {
        return repository.findAll();
    }

    public Optional<T> getById(ID id) {
        return repository.findById(id);
    }

    public Optional<T> update(ID id, T updatedEntity) {
        return repository.findById(id).map(existing -> {
            return repository.save(updatedEntity);
        });
    }

    public void delete(ID id) {
        repository.deleteById(id);
    }

}
