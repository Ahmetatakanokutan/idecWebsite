package com.example.idectt.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(length = 512)
    private String image;

    private String leader;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_sectors", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "sector")
    private List<String> sectors = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_partners", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "partner")
    private List<String> partners = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_objectives", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "objective")
    private List<String> objectives = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "project_outcomes", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "outcome")
    private List<String> outcomes = new ArrayList<>();

    public Project(String title, String description, String image, String leader) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.leader = leader;
    }
}
