package com.example.crud.repository;

import com.example.crud.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Marks this interface as a Spring Data repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    // JpaRepository provides common CRUD operations (save, findById, findAll, deleteById)
    // No need to write custom methods for basic CRUD
}