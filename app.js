document.addEventListener('DOMContentLoaded', function() {
    // JSON 파일에서 프로젝트 목록을 불러오기
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

    // 방명록 기능 구현
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');
    const allGuestbookEntries = document.getElementById('all-guestbook-entries');
    const viewMoreButton = document.getElementById('view-more-button');

    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;

            guestbookForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const name = document.getElementById('guest-name').value;
                const message = document.getElementById('guest-message').value;
                const timestamp = new Date().toLocaleString();

                const entry = document.createElement('div');
                entry.className = 'guestbook-entry';

                const entryText = document.createElement('div');
                entryText.className = 'entry-text';
                entryText.innerHTML = `<strong>${name} (${ip})</strong> <small>${timestamp}</small><p>${message}</p>`;

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = '삭제';

                deleteButton.addEventListener('click', function() {
                    const password = prompt('관리자 비밀번호를 입력하세요:');
                    if (password === '1111') {
                        entry.remove();
                        updateGuestbookVisibility();
                    } else {
                        alert('비밀번호가 틀렸습니다.');
                    }
                });

                entry.appendChild(entryText);
                entry.appendChild(deleteButton);

                guestbookEntries.prepend(entry);
                allGuestbookEntries.prepend(entry.cloneNode(true));

                // 최대 5개의 방명록 항목만 유지
                updateGuestbookVisibility();

                guestbookForm.reset();
            });
        })
        .catch(error => {
            console.error('Error fetching IP:', error);
        });

    function updateGuestbookVisibility() {
        const entries = Array.from(guestbookEntries.children);
        entries.forEach((entry, index) => {
            entry.style.display = index < 5 ? 'flex' : 'none';
        });
    }

    viewMoreButton.addEventListener('click', function() {
        window.location.href = '#guestbook-all';
    });
});
