<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { CustomLoadEvent } from '$lib/types/auth/load';
	export const load: Load = ({ session }: CustomLoadEvent) => {
		if (session.user && session.user.id === '') {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	};
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Bold from '@tiptap/extension-bold';
	import Code from '@tiptap/extension-code';
	import OrderedList from '@tiptap/extension-ordered-list';
	import BulletList from '@tiptap/extension-bullet-list';
	import ListItem from '@tiptap/extension-list-item';
	import '$lib/styles/editor.css';
	import debounce from 'lodash-es/debounce';
	import { Button } from 'flowbite-svelte';
	import { userStore } from '../store';
	import { goto } from '$app/navigation';

	let element: Element | undefined;
	let editor: Editor | undefined;
	let content: ReturnType<typeof Editor.prototype.getJSON> | undefined;

	const storeContent = debounce((contentObj: ReturnType<typeof Editor.prototype.getJSON>) => {
		content = contentObj;
		localStorage.setItem('devrant-draft', JSON.stringify(contentObj));
	}, 1000);

	const handleSubmitBlog = async () => {
		if (!content) {
			return;
		}
		const response = await fetch('/editor', {
			method: 'POST',
			body: JSON.stringify({
				content: JSON.stringify(content),
				title: 'Test this title',
				subTitle: 'Test this subtitle',
				creatorId: $userStore.id
			}),
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			}
		});
		if (!response.ok) {
			console.log((await response.json()).message);
			return;
		}
		const blog = await response.json();
		localStorage.removeItem('devrant-draft');
		goto(`/blogs/${blog.id}`);
	};

	onMount(() => {
		Link.configure({
			autolink: true,
			openOnClick: true,
			linkOnPaste: true
		});
		Image.configure({
			inline: true
		});
		OrderedList.configure({
			itemTypeName: 'listItem',
			HTMLAttributes: {
				class: 'ordered-list'
			}
		});
		BulletList.configure({
			itemTypeName: 'listItem',
			HTMLAttributes: {
				class: 'bullet-list'
			}
		});
		let draftContent = localStorage.getItem('devrant-draft');
		if (draftContent) {
			const keepDraft = confirm('do you want to continue with the draft?');
			if (!keepDraft) {
				draftContent = null;
				localStorage.removeItem('devrant-draft');
			}
		}
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Link, Image, Bold, Code, OrderedList, BulletList, ListItem],
			content: draftContent ? JSON.parse(draftContent) : 'Start here. The textbox is invisible!',
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
				if (editor) {
					storeContent(editor.getJSON());
				}
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

<svelte:head>
	<title>Dev's Tangent Editor</title>
	<meta name="description" content="Dev's Tangent editor" />
</svelte:head>

{#if editor}
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor?.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
	<button
		on:click={() => editor?.chain().focus().setBold().run()}
		class:active={editor.isActive('bold')}
	>
		B
	</button>
	<button
		on:click={() => editor?.chain().focus().setCode().run()}
		class:active={editor.isActive('code')}
	>
		Code
	</button>
	<button
		on:click={() => {
			const previousUrl = editor?.getAttributes('link').href;
			const url = window.prompt('URL', previousUrl);

			if (url === null) {
				return;
			}
			if (url === '') {
				editor?.chain().focus().extendMarkRange('link').unsetLink().run();
				return;
			}
			editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
		}}
		class:active={editor.isActive('link')}
	>
		Link
	</button>
	<button
		on:click={() => {
			const url = window.prompt('URL');

			if (url && editor) {
				editor.chain().focus().setImage({ src: url }).run();
			}
		}}>Image</button
	>
	<button
		on:click={() => editor?.chain().focus().toggleOrderedList().run()}
		class:active={editor.isActive('orderedList')}
	>
		Toggle Ordered List
	</button>
	<button
		on:click={() => editor?.chain().focus().splitListItem('listItem').run()}
		disabled={!editor.can().splitListItem('listItem')}
	>
		Split list
	</button>
	<button
		on:click={() => editor?.chain().focus().sinkListItem('listItem').run()}
		disabled={!editor.can().sinkListItem('listItem')}
	>
		Move to inner list
	</button>
	<button
		on:click={() => editor?.chain().focus().liftListItem('listItem').run()}
		disabled={!editor.can().liftListItem('listItem')}
	>
		Move to outer list
	</button>
	<button
		on:click={() => editor?.chain().focus().toggleBulletList().run()}
		class:active={editor.isActive('bulletList')}
	>
		Toggle bullet list
	</button>
	<button
		on:click={() => editor?.chain().focus().splitListItem('listItem').run()}
		disabled={!editor.can().splitListItem('listItem')}
	>
		Split bullet list
	</button>
	<button
		on:click={() => editor?.chain().focus().sinkListItem('listItem').run()}
		disabled={!editor.can().sinkListItem('listItem')}
	>
		Move to inner bullet list
	</button>
	<button
		on:click={() => editor?.chain().focus().liftListItem('listItem').run()}
		disabled={!editor.can().liftListItem('listItem')}
	>
		Move to outer bullet list
	</button>
{/if}

<div bind:this={element} />
<Button on:click={handleSubmitBlog}>Submit</Button>

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
