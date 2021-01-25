/**
 * External dependencies
 */
import { map } from 'lodash';

/**
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';
import { cloneBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Retrieves the block patterns inserter state.
 *
 * @param {string=}  rootClientId Insertion's root client ID.
 * @param {Function} onInsert     function called when inserter a list of blocks.
 *
 * @return {Array} Returns the patterns state. (patterns, categories, onSelect handler)
 */
const usePatternsState = ( rootClientId, onInsert ) => {
	const { patternCategories, patterns } = useSelect(
		( select ) => {
			const { __experimentalGetAllowedPatterns, getSettings } = select(
				'core/block-editor'
			);
			return {
				patterns: __experimentalGetAllowedPatterns( rootClientId ),
				patternCategories: getSettings()
					.__experimentalBlockPatternCategories,
			};
		},
		[ rootClientId ]
	);
	const { createSuccessNotice } = useDispatch( noticesStore );
	const onClickPattern = useCallback( ( pattern, blocks ) => {
		onInsert(
			map( blocks, ( block ) => cloneBlock( block ) ),
			pattern.name
		);
		createSuccessNotice(
			sprintf(
				/* translators: %s: block pattern title. */
				__( 'Block pattern "%s" inserted.' ),
				pattern.title
			),
			{
				type: 'snackbar',
			}
		);
	}, [] );

	return [ patterns, patternCategories, onClickPattern ];
};

export default usePatternsState;
