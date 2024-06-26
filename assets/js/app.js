// assets/js/app.js
document.addEventListener('DOMContentLoaded', async function() {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    async function fetchComments() {
        try {
            const commentData = await Amplify.API.graphql({ query: window.listComments });
            const comments = commentData.data.listComments.items;
            guestbookEntries.innerHTML = "";
            comments.forEach(comment => {
                const entryElement = createGuestbookEntry(comment);
                guestbookEntries.appendChild(entryElement);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    fetchComments();

    guestbookForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('guest-name').value;
        const message = document.getElementById('guest-message').value;
        const createdAt = new Date().toISOString();

        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            const ip = ipData.ip;

            const entry = { name, message, createdAt, ip };

            await Amplify.API.graphql({ query: window.createComment, variables: { input: entry } });
            saveToBackup(entry);
            fetchComments();

            guestbookForm.reset();
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    });

    function createGuestbookEntry({ id, name, message, createdAt, ip }) {
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';

        const date = createdAt.split('T')[0];
        const time = createdAt.split('T')[1].split('.')[0];

        const entryText = document.createElement('div');
        entryText.className = 'entry-text';
        entryText.innerHTML = `<strong>${name}</strong> <small>(${date} ${time})</small> <p>${message}</p> <small>IP: ${ip}</small>`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '삭제';

        deleteButton.addEventListener('click', async function() {
            const password = prompt('관리자 비밀번호를 입력하세요:');
            if (password === '1010') {
                try {
                    await Amplify.API.graphql({ query: window.deleteComment, variables: { input: { id } } });
                    fetchComments();
                } catch (error) {
                    console.error('Error deleting comment:', error);
                }
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        });

        entry.appendChild(entryText);
        entry.appendChild(deleteButton);

        return entry;
    }

    function saveToBackup(entry) {
        const backupData = `${entry.createdAt} - ${entry.name}: ${entry.message} (IP: ${entry.ip})\n`;
        const blob = new Blob([backupData], { type: 'text/plain' });
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'guestbook_backup.txt';
        anchor.click();
    }
});
