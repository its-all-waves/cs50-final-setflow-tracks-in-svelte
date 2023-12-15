<script>
	import { characters, scenes, tracks } from './machine'

	export let mousePosition
	export let menuTarget // that which was right-clicked
	let node

	$: type = menuTarget.matches('.character')
		? 'character'
		: menuTarget.matches('.track')
		? 'track'
		: menuTarget.matches('.scene')
		? 'scene'
		: undefined

	$: newContextMenuEvent = (eventName) => {
		return new CustomEvent(eventName, {
			bubbles: true,
			detail: {
				type,
				id: menuTarget.id
			}
		})
	}

	$: renameEvent = newContextMenuEvent('contextmenu-click-rename')
	$: deleteEvent = newContextMenuEvent('contextmenu-click-delete')

	// adjust my position if partially offscreen
	$: if (node) setPosition(node, mousePosition)

	function setPosition(node, mousePosition) {
		const menuDimensions = node.getBoundingClientRect()

		const viewport = window.visualViewport
		const viewportRight = viewport.pageLeft + viewport.width + viewport.offsetLeft
		const viewportBottom = viewport.pageTop + viewport.height + viewport.offsetTop

		let { x, y } = mousePosition
		const menuBoundsRight = x + menuDimensions.width
		const menuBoundsBottom = y + menuDimensions.height

		if (menuBoundsRight > viewportRight) x -= menuDimensions.width
		if (menuBoundsBottom > viewportBottom) y -= menuDimensions.height

		node.style.left = parseInt(x) + 'px'
		node.style.top = parseInt(y) + 'px'
	}

	const contextMenus = {
		character: [
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
	// chars, tracks, scenes all have the same functionality for now
	contextMenus.track = [...contextMenus.character]
	contextMenus.scene = [...contextMenus.character]

	$: presentedOptions = contextMenus[type]

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

		{#each presentedOptions as { option, fn }}
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
		border: 1px solid #534594;
		margin: 0;
		padding: 0.1rem;
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
		border: 0.5px solid goldenrod;
	}
</style>
