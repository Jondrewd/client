import React, { useState, useCallback } from 'react';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';
import api from '../../services/api'; // Certifique-se de ajustar o caminho para o seu serviço de API
import './styles.css'; // Importe o arquivo CSS

const Autocomplete = ({ setTitle }) => {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const fetchSuggestions = async (value) => {
        try {
            const response = await api.get(`/books/title/{value}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

    const onSuggestionsFetchRequested = ({ value }) => {
        debouncedFetchSuggestions(value);
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const getSuggestionValue = (suggestion) => suggestion.name;

    const renderSuggestion = (suggestion) => (
        <div className="autosuggest__suggestion">
            {suggestion.name}
        </div>
    );

    const inputProps = {
        placeholder: 'Digite o nome do Livro',
        value,
        onChange: (e, { newValue }) => {
            setValue(newValue);
            setTitle(newValue);
        },
        className: 'autosuggest__input'
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            theme={{
                container: 'autosuggest__container',
                suggestionsContainer: 'autosuggest__suggestions-container',
                suggestionHighlighted: 'autosuggest__suggestion--highlighted'
            }}
        />
    );
};

export default Autocomplete;
