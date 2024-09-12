document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = [
        { title: "Introduction to Self-Organizing Systems", url: "#" },
        { title: "Exploring Collective Intelligence in AI", url: "#" },
        { title: "Applying Nature-Inspired Systems in ML", url: "#" }
    ];

    const blogList = document.getElementById('blog-list');

    blogPosts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = post.url;
        link.textContent = post.title;

        listItem.appendChild(link);
        blogList.appendChild(listItem);
    });
});
