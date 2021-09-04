<template>
	<button
		class="
			p-2
			transition-colors
			hover:bg-gray-200
			active:bg-gray-300
			rounded
			focus:outline-none
			dark:(hover:bg-dark-300
			active:bg-dark-400)
		"
	>
		<slot />
	</button>
</template>
