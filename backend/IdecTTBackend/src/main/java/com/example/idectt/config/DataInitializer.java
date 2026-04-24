package com.example.idectt.config;

import com.example.idectt.entity.*;
import com.example.idectt.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InstructorRepository instructorRepository;
    private final CourseRepository courseRepository;
    private final ProjectRepository projectRepository;
    private final boolean adminBootstrapEnabled;
    private final String adminBootstrapEmail;
    private final String adminBootstrapPassword;
    private final String adminBootstrapFullName;
    private final String adminBootstrapPhone;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository,
                           PasswordEncoder passwordEncoder, InstructorRepository instructorRepository,
                           CourseRepository courseRepository, ProjectRepository projectRepository,
                           @Value("${idectt.bootstrap.admin.enabled:false}") boolean adminBootstrapEnabled,
                           @Value("${idectt.bootstrap.admin.email:}") String adminBootstrapEmail,
                           @Value("${idectt.bootstrap.admin.password:}") String adminBootstrapPassword,
                           @Value("${idectt.bootstrap.admin.fullName:IDEC-TT Admin}") String adminBootstrapFullName,
                           @Value("${idectt.bootstrap.admin.phone:}") String adminBootstrapPhone) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.instructorRepository = instructorRepository;
        this.courseRepository = courseRepository;
        this.projectRepository = projectRepository;
        this.adminBootstrapEnabled = adminBootstrapEnabled;
        this.adminBootstrapEmail = adminBootstrapEmail;
        this.adminBootstrapPassword = adminBootstrapPassword;
        this.adminBootstrapFullName = adminBootstrapFullName;
        this.adminBootstrapPhone = adminBootstrapPhone;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeRolesAndUsers();
        initializeCourses();
        initializeProjects();
    }

    private void initializeRolesAndUsers() {
        if (roleRepository.findByRoleName(ERole.ROLE_ADMIN).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_ADMIN));
        }
        if (roleRepository.findByRoleName(ERole.ROLE_USER).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_USER));
        }
        if (roleRepository.findByRoleName(ERole.ROLE_COMPANY).isEmpty()) {
            roleRepository.save(new Role(null, ERole.ROLE_COMPANY));
        }

        if (!adminBootstrapEnabled) {
            return;
        }

        if (adminBootstrapEmail == null || adminBootstrapEmail.isBlank()
                || adminBootstrapPassword == null || adminBootstrapPassword.isBlank()) {
            System.out.println("Admin bootstrap is enabled but BOOTSTRAP_ADMIN_EMAIL or BOOTSTRAP_ADMIN_PASSWORD is missing.");
            return;
        }

        Role adminRole = roleRepository.findByRoleName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));

        User adminUser = userRepository.findByUsername(adminBootstrapEmail).orElseGet(() -> {
            User user = new User(
                    adminBootstrapEmail,
                    passwordEncoder.encode(adminBootstrapPassword),
                    adminBootstrapFullName,
                    adminBootstrapPhone
            );
            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            user.setRoles(roles);
            return user;
        });

        // Ensure bootstrap admin account is enabled for login.
        if (!Boolean.TRUE.equals(adminUser.getIsEmailVerified())) {
            adminUser.setIsEmailVerified(true);
        }
        if (adminUser.getRoles() == null) {
            adminUser.setRoles(new HashSet<>());
        }
        adminUser.getRoles().add(adminRole);

        userRepository.save(adminUser);
    }

    private void initializeCourses() {
        if (courseRepository.count() > 0) {
            return; // Courses already initialized
        }

        Instructor instructor1 = instructorRepository.findByName("Dr. Ahmet Yılmaz")
                .orElseGet(() -> instructorRepository.save(new Instructor("Dr. Ahmet Yılmaz", "Enerji Sistemleri Uzmanı")));
        Course course1 = new Course("Karbonsuzlaştırma Temelleri", "Karbonsuzlaştırma süreçlerinin temel prensiplerini öğrenin", "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600");
        course1.setInstructor(instructor1);
        
        Section section1 = new Section("Bölüm 1: Giriş", course1);
        section1.addLesson(new Lesson("Karbonsuzlaştırmaya Giriş", "15 dk", "https://www.youtube.com/embed/ScMzIvxBSi4"));
        course1.addSection(section1);
        
        courseRepository.save(course1);

        Instructor instructor2 = instructorRepository.findByName("Prof. Dr. Zeynep Kaya")
                .orElseGet(() -> instructorRepository.save(new Instructor("Prof. Dr. Zeynep Kaya", "Sürdürülebilirlik Profesörü")));
        Course course2 = new Course("Sürdürülebilir Enerji Sistemleri", "Modern sürdürülebilir enerji sistemlerinin tasarımı ve uygulaması", "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=600");
        course2.setInstructor(instructor2);
        
        Section section2 = new Section("Modül 1", course2);
        course2.addSection(section2);
        courseRepository.save(course2);

        Instructor instructor3 = instructorRepository.findByName("Dr. Mehmet Özkan")
                .orElseGet(() -> instructorRepository.save(new Instructor("Dr. Mehmet Özkan", "Karbon Yönetimi Stratejisti")));
        Course course3 = new Course("Karbon Yakalama ve Depolama", "Karbon yakalama teknolojileri ve depolama yöntemleri", "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&w=600");
        course3.setInstructor(instructor3);
        
        Section section3 = new Section("Giriş", course3);
        course3.addSection(section3);
        courseRepository.save(course3);

        System.out.println("Initialized " + courseRepository.count() + " courses.");
    }

    private void initializeProjects() {
        if (projectRepository.count() > 0) {
            return; // Projects already initialized
        }

        Project project1 = new Project(
                "İkiz Dönüşüm Yoluyla Endüstriyel Dekarbonizasyon (IDEC-TT)",
                "İstanbul Kalkınma Ajansı İkiz Dönüşüm Mali Destek Programı kapsamında yürütülen ana projemiz",
                "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=600",
                "Yeditepe Üniversitesi"
        );
        project1.setSectors(List.of("Demir-Çelik", "Çimento", "Alüminyum", "Kimya"));
        project1.setPartners(List.of("Türkiye İhracatçılar Meclisi (TİM)", "Türkiye Döküm Sanayicileri Derneği (TÜDÖKSAD)", "Türkiye Alüminyum Sanayiciler Derneği (TALSAD)"));
        project1.setObjectives(List.of("Dijital kütüphane altyapısının kurulması", "KarbonBot yapay zeka sisteminin geliştirilmesi", "Eğitim ve mentorluk süreci tasarımı", "Proje yönetimi ve koordinasyonunun sağlanması"));
        project1.setOutcomes(List.of("En az 400 sektör çalışanına eğitim", "Karbon ayak izi hesaplama araçları", "SKDM uyumu için rehberlik", "Firmalara özel ikiz dönüşüm yol haritaları"));
        projectRepository.save(project1);

        Project project2 = new Project(
                "Endüstriyel Dekarbonizasyon Projesi (IDEC) - IPA",
                "AB-Türkiye İklim Değişikliği Hibe Programı kapsamında Karbon Çözümleri Merkezi kurulumu",
                "https://images.pexels.com/photos/9800026/pexels-photo-9800026.jpeg?auto=compress&cs=tinysrgb&w=600",
                "Yeditepe Üniversitesi"
        );
        project2.setSectors(List.of("Demir-Çelik", "Çimento", "Alüminyum", "Kimya"));
        project2.setPartners(List.of("Türk Çimento", "Türkiye Alüminyum Sanayiciler Derneği (TALSAD)", "Endüstriyel Otomasyon Sanayicileri Derneği (ENOSAD)"));
        project2.setObjectives(List.of("Yenilikçi Karbon Çözümleri Laboratuvarı (ICSL) kurulumu", "Karbon Akademisi (CA) oluşturulması", "Sosyal, Ekonomik ve Politika Araştırma Birimi (SEPR) kurulumu", "Ülkemizin sıfır-karbon hedefine ulaşmasının hızlandırılması"));
        project2.setOutcomes(List.of("CO2 geri kazanımı için yeni nesil adsorbanlar", "Genç mühendisler için eğitim ve farkındalık programları", "Karbon emisyonları konusunda sosyal bilim perspektifleri", "Karbon Çözümleri Merkezi (CSC) araştırma merkezi"));
        projectRepository.save(project2);

        System.out.println("Initialized " + projectRepository.count() + " projects.");
    }
}
