document.addEventListener('DOMContentLoaded', function() {
    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            const projectList = document.getElementById('project-list');

            projects.forEach(project => {
                const projectItem = document.createElement('div');
                projectItem.className = 'project-item';

                const thumbnailLink = document.createElement('a');
                thumbnailLink.href = project.link;

                const thumbnail = document.createElement('img');
                thumbnail.src = project.thumbnail;
                thumbnail.alt = project.title;
                thumbnail.className = 'project-thumbnail';

                thumbnailLink.appendChild(thumbnail);

                const projectInfo = document.createElement('div');
                projectInfo.className = 'project-info';

                const projectTitleLink = document.createElement('a');
                projectTitleLink.href = project.link;

                const projectTitle = document.createElement('h3');
                projectTitle.textContent = project.title;

                projectTitleLink.appendChild(projectTitle);

                const projectDescription = document.createElement('p');
                projectDescription.textContent = project.description;

                projectInfo.appendChild(projectTitleLink);
                projectInfo.appendChild(projectDescription);

                projectItem.appendChild(thumbnailLink);
                projectItem.appendChild(projectInfo);

                projectList.appendChild(projectItem);
            });
        });
});