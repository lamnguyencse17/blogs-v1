<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { generateHTML } from '@tiptap/html';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import Bold from '@tiptap/extension-bold';
	import Code from '@tiptap/extension-code';
	import OrderedList from '@tiptap/extension-ordered-list';
	import BulletList from '@tiptap/extension-bullet-list';
	import ListItem from '@tiptap/extension-list-item';
	import type { SingleBlog } from './[id]';
	export let blogResponse: SingleBlog;
</script>

{#if !blogResponse}
	<div>Something went wrong</div>
{:else}
	{@html generateHTML(JSON.parse(blogResponse.content), [
		StarterKit,
		Link,
		Image,
		Bold,
		Code,
		OrderedList,
		BulletList,
		ListItem
	])}
	{blogResponse.subTitle}
{/if}
