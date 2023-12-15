<script>
	import { characters, scenes, tracks } from './machine'

	export let position
	export let menuTarget
	let node

	$: type = menuTarget.matches('.character')
		? 'character'
		: menuTarget.matches('.track')
		? 'track'
		: 'scene'

	$: renameEvent = new CustomEvent('contextmenu-click-rename', {
		bubbles: true,
		detail: {
			type,
			id: menuTarget.id
		}
	})

	$: deleteEvent = new CustomEvent('contextmenu-click-delete', {
		bubbles: true,
		detail: {
			type,
			id: menuTarget.id
		}
	})

	// adjust my position if partially offscreen
	$: if (node) {
		const dimensions = node.getBoundingClientRect()

		const viewport = window.visualViewport
		const viewportRight = viewport.pageLeft + viewport.offsetLeft + viewport.width
		const viewportBottom = viewport.pageTop + viewport.offsetTop + viewport.height

		const boundsRight = position.left + dimensions.width
		const boundsBottom = position.top + dimensions.height

		const adjustedLeft =
			boundsRight > viewportRight ? position.left - dimensions.width : position.left
		const adjustedTop =
			boundsBottom > viewportBottom ? position.top - dimensions.height : position.top

		node.style.left = parseInt(adjustedLeft) + 'px'
		node.style.top = parseInt(adjustedTop) + 'px'
	}

	let contextMenus = {
		character: [
			{
				option: 'rename',
				fn: () => node.dispatchEvent(renameEvent)
			},
			{
				option: 'delete',
				fn: () => node.dispatchEvent(deleteEvent)
			}
		],
		track: [
			{
				option: 'rename',
				fn: () => node.dispatchEvent(renameEvent)
			},
			{
				option: 'delete',
				fn: () => node.dispatchEvent(deleteEvent)
			}
		],
		scene: [
			{
				option: 'rename',
				fn: () => node.dispatchEvent(renameEvent)
			},
			{
				option: 'delete',
				fn: () => node.dispatchEvent(deleteEvent)
			}
		]
	}

	$: options = contextMenus[type]

	$: name =
		type === 'character'
			? $characters[menuTarget.id]?.name
			: type === 'track'
			? $tracks[menuTarget.id]?.name
			: type === 'scene'
			? $scenes[menuTarget.id]?.name
			: undefined
</script>

<menu>
	<ul
		class="context-menu"
		bind:this={node}
	>
		<h1>{name}</h1>

		{#each options as { option, fn }}
			<li on:pointerup={fn}>{option}</li>
		{/each}
	</ul>
</menu>

<style>
	ul {
		position: absolute;
		height: fit-content;
		width: 12ch;
		background: #141e26;
		box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.5), 0px 6px 12px rgba(0, 0, 0, 0.5);
	}

	ul {
		margin: 0;
		padding: 0.1rem;
	}

	ul {
		border: 1px solid #534594;
	}

	h1 {
		border: 0.5px solid goldenrod;
	}

	ul,
	li,
	h1 {
		border-radius: 0.3rem;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		list-style: none;
		margin: 0.3rem;
		padding: 0.1rem;
		font-size: 0.9rem;
	}

	li:hover {
		background: #083151;
	}

	h1 {
		font-size: 0.9rem;
		text-align: center;
		margin: 0.3rem;
		margin-bottom: 0.4rem;
	}
</style>
