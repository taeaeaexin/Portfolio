document.addEventListener('DOMContentLoaded', function() {
    // 프로젝트 목록 불러오기
    fetch('assets/json/projects.json')
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

    // 로컬 저장소에서 방명록 항목 불러오기
    const storedEntries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    storedEntries.forEach(entry => {
        const entryElement = createGuestbookEntry(entry);
        guestbookEntries.appendChild(entryElement);
    });

    guestbookForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('guest-name').value;
        const message = document.getElementById('guest-message').value;
        const timestamp = new Date();
        const date = `${timestamp.getFullYear() % 100}.${(timestamp.getMonth() + 1).toString().padStart(2, '0')}.${timestamp.getDate().toString().padStart(2, '0')}`;
        const time = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
        const entry = { name, date, time, message };

        const entryElement = createGuestbookEntry(entry);
        guestbookEntries.prepend(entryElement);

        // 로컬 저장소에 방명록 항목 저장
        storedEntries.push(entry);
        localStorage.setItem('guestbookEntries', JSON.stringify(storedEntries));

        guestbookForm.reset();
    });

    function createGuestbookEntry({ name, date, time, message }) {
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';

        const entryText = document.createElement('div');
        entryText.className = 'entry-text';
        entryText.innerHTML = `<strong>${name}</strong> <small>(${date} ${time})</small> <p>${message}</p>`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '삭제';

        deleteButton.addEventListener('click', function() {
            const password = prompt('관리자 비밀번호를 입력하세요:');
            if (password === '1111') {
                entry.remove();
                const index = storedEntries.findIndex(e => e.name === name && e.message === message && e.date === date && e.time === time);
                if (index > -1) {
                    storedEntries.splice(index, 1);
                    localStorage.setItem('guestbookEntries', JSON.stringify(storedEntries));
                }
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        });

        entry.appendChild(entryText);
        entry.appendChild(deleteButton);

        return entry;
    }
});
