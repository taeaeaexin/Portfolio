// assets/js/app.js
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';
import { createComment } from './graphql/mutations';
import { listComments } from './graphql/queries';

Amplify.configure(awsExports);

document.addEventListener('DOMContentLoaded', async function() {
    const guestbookForm = document.getElementById('guestbook-form');
    const guestbookEntries = document.getElementById('guestbook-entries');

    async function fetchComments() {
        const commentData = await API.graphql(graphqlOperation(listComments));
        const comments = commentData.data.listComments.items;
        guestbookEntries.innerHTML = "";
        comments.forEach(comment => {
            const entryElement = createGuestbookEntry(comment);
            guestbookEntries.appendChild(entryElement);
        });
    }

    fetchComments();

    guestbookForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = document.getElementById('guest-name').value;
        const message = document.getElementById('guest-message').value;
        const createdAt = new Date().toISOString();

        // IP 주소 가져오기
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        const entry = { name, message, createdAt, ip };

        await API.graphql(graphqlOperation(createComment, { input: entry }));
        fetchComments();

        guestbookForm.reset();
    });

    function createGuestbookEntry({ name, message, createdAt }) {
        const entry = document.createElement('div');
        entry.className = 'guestbook-entry';

        const date = createdAt.split('T')[0];
        const time = createdAt.split('T')[1].split('.')[0];

        const entryText = document.createElement('div');
        entryText.className = 'entry-text';
        entryText.innerHTML = `<strong>${name}</strong> <small>(${date} ${time})</small> <p>${message}</p>`;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '삭제';

        deleteButton.addEventListener('click', async function() {
            const password = prompt('관리자 비밀번호를 입력하세요:');
            if (password === '1111') {
                await API.graphql(graphqlOperation(deleteComment, { input: { id } }));
                fetchComments();
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        });

        entry.appendChild(entryText);
        entry.appendChild(deleteButton);

        return entry;
    }
});
