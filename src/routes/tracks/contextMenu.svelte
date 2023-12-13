<script>
	export let position
	export let target
	let node

	$: menuType = target.matches('.character') ? 'character' : 'header'

	// adjust my position if partially offscreen
	$: if (node) {
		const dimensions = node.getBoundingClientRect()

		const viewport = window.visualViewport
		const viewportRight = viewport.pageLeft + viewport.offsetLeft + viewport.width
		// const viewportRight = viewport.pageLeft + viewport.width
		const viewportBottom = viewport.pageTop + viewport.offsetTop + viewport.height
		// const viewportBottom = viewport.pageTop + viewport.height

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
				fn: () => {
					node.dispatchEvent(
						new CustomEvent('contextmenu-click-rename', {
							bubbles: true,
							detail: {
								type: 'character',
								id: target.id
							}
						})
					)
				}
			},
			{
				option: 'delete',
				fn: () => {
					node.dispatchEvent(
						new CustomEvent('contextmenu-click-delete', {
							bubbles: true,
							detail: {
								type: 'character',
								id: target.id
							}
						})
					)
				}
			}
		],
		header: [
			{
				option: 'rename',
				fn: () => {
					node.dispatchEvent(
						new CustomEvent('contextmenu-click-rename', {
							bubbles: true,
							detail: {
								type: 'header',
								id: target.id
							}
						})
					)
				}
			},
			{
				option: 'delete',
				fn: () => {
					node.dispatchEvent(
						new CustomEvent('contextmenu-click-delete', {
							bubbles: true,
							detail: {
								type: 'header',
								id: target.id
							}
						})
					)
				}
			}
		]
	}

	$: options = contextMenus[menuType]
</script>

<ul
	class="context-menu"
	bind:this={node}
>
	<h1>{target.id}</h1>
	{#each options as { option, fn }}
		<li on:pointerup={fn}>{option}</li>
	{/each}
</ul>

<style>
	ul {
		position: absolute;
		height: fit-content;
		width: 12ch;
		background: black;
	}

	ul {
		margin: 0;
		padding: 0.1rem;
	}

	ul,
	li,
	h1 {
		border-radius: 0.1rem;
	}

	li {
		line-height: 1.3rem;
		height: 1.3rem;
		background: none;
		list-style: none;
		text-align: center;
		margin: 0.3rem;
	}

	li:hover {
		background: rgb(67, 67, 67);
	}

	h1 {
		font-size: 0.9rem;
		text-align: center;
		margin: 0.3rem;
		border: 0.5px solid rgb(94, 94, 94);
	}
</style>
