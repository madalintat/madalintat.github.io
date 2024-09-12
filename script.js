document.addEventListener('DOMContentLoaded', () => {
    // Blog Posts Data
    const blogPosts = [
        { title: "Introduction to Self-Organizing Systems", url: "#" },
        { title: "Exploring Collective Intelligence in AI", url: "#" },
        { title: "Applying Nature-Inspired Systems in ML", url: "#" }
    ];

    // Projects Data
    const projects = [
        { title: ".worlds", description: "a site that generates lo-fi music vides", imgSrc: "project1.jpg", url: "#.worlds" },
        { title: "detecting distracted drivers", description: "a simple computer vision classiffier", imgSrc: "project2.jpg", url: "#distracted-drivers" },
    ];

    // Render Blog Posts
    const blogList = document.getElementById('blog-list');
    blogPosts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = post.url;
        link.textContent = post.title;

        listItem.appendChild(link);
        blogList.appendChild(listItem);
    });

    // Render Projects
    const projectsGrid = document.getElementById('projects-grid');
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');

        const img = document.createElement('img');
        img.src = project.imgSrc;
        img.alt = project.title;

        const title = document.createElement('h3');
        title.textContent = project.title;

        const description = document.createElement('p');
        description.textContent = project.description;

        const link = document.createElement('a');
        link.href = project.url;
        link.textContent = "View Project";

        projectDiv.appendChild(img);
        projectDiv.appendChild(title);
        projectDiv.appendChild(description);
        projectDiv.appendChild(link);

        projectsGrid.appendChild(projectDiv);
    });
});
