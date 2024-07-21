import React, { useEffect, useState } from 'react';

const KEY = 'DRJXEQBTC76LQAB7D9XV59T4L';

export default function Home() {
    const [query, setQuery] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [weekData, setWeekData] = useState(null);
    const [resolvedAddress, setResolvedAddress] = useState(null);
    const [error, setError] = useState(null);
    const [weekday, setWeekday] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchWeatherAndLocation() {
            if (!query) return;

            setLoading(true);

            try {
                const res = await fetch(
                    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?unitGroup=metric&key=${KEY}&contentType=json`
                );
                if (!res.ok) {
                    throw new Error('Data not found');
                }
                const data = await res.json();
                if (data && data.days && data.days.length > 0) {
                    setWeatherData(data.days[0]);
                    setWeekData(data.days.slice(0, 8));
                    setResolvedAddress(data.resolvedAddress);
                    setError(null);

                    const date = data.days[0].datetime;
                    const weekday = calculateWeekday(date);
                    setWeekday(weekday);
                } else {
                    setError('No data available');
                    setWeatherData(null);
                    setWeekData(null);
                    setResolvedAddress(null);
                }
            } catch (error) {
                setError('An error occurred. Please try again.');
                setWeatherData(null);
                setWeekData(null);
                setResolvedAddress(null);
            } finally {
                setLoading(false);
            }
        }

        fetchWeatherAndLocation();
    }, [query]);

    const calculateWeekday = (dateString) => {
        const date = new Date(dateString);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[date.getDay()];
    };

    function handleStatus(icon) {
        switch (icon) {
            case 'rain':
                return '🌧️';
            case 'partly-cloudy-day':
                return '⛅';
            case 'clear-day':
                return '🌞';
            case 'windy':
                return '🌬️';
            case 'fog':
                return '🌫️';
            case 'cloudy':
                return '☁️';
            case 'snow':
                return '❄️';
            case 'thunderstorm':
                return '⛈️';
            case 'clear-night':
                return '🌜';
            case 'partly-cloudy-night':
                return '🌛';
            default:
                return '';
        }
    }

    function handleSearch() {
        if (query.trim() !== '') {
            const encodedQuery = encodeURIComponent(query.trim());
            setQuery(encodedQuery);
        }
    }

    function handleSelect(index) {
        setWeatherData(weekData[index]);
        const date = weekData[index].datetime;
        const weekday = calculateWeekday(date);
        setWeekday(weekday);
    }

    const iconSymbol = weatherData ? handleStatus(weatherData.icon) : '';

    return (
        <>
            <div className='home-page'>
                <Section className='left-section'>
                    {loading ? (
                        <div>Loading...</div>
                    ) : weatherData ? (
                        <>
                            <div className='name'>{weekday}</div>
                            <h1>{iconSymbol}</h1>
                            <div className="day">{weatherData.datetime}</div>
                            <div className="temperature">{weatherData.tempmax} °C</div>
                            <div className="description">{weatherData.description}</div>
                        </>
                    ) : (
                        <div>{error}</div>
                    )}
                </Section>

                <Section className='right-section'>
                    <Search query={query} setQuery={setQuery} />
                    <Location resolvedAddress={resolvedAddress} />

                    {weatherData && (
                        <Temps maxTemp={weatherData.tempmax} minTemp={weatherData.tempmin} />
                    )}

                    {weatherData && (
                        <AdditionalInfos
                            feels={weatherData.feelslike}
                            humidity={weatherData.humidity}
                            wind={weatherData.windspeed}
                        />
                    )}
                </Section>

                {weekData && (
                    <Section className='sPart'>
                        <DaysList days={weekData} onIcon={handleStatus} onSelect={handleSelect} />
                    </Section>
                )}
            </div>
        </>
    );
}

function DaysList({ days, onIcon, onSelect }) {
    return (
        <div className="list">
            {days.map((day, index) => (
                <Day key={index} day={day} onIcon={onIcon} onSelect={() => onSelect(index)} />
            ))}
        </div>
    );
}

function Day({ day, onIcon, onSelect }) {
    return (
        <div onClick={onSelect} className='day-Event'>
            <h4>{calculateWeekday(day.datetime)}</h4>
            <h1>{onIcon(day.icon)}</h1>
            <h4>{day.tempmax}° {day.tempmin}°</h4>
        </div>
    );
}

function calculateWeekday(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
}

function AdditionalInfos({ feels, humidity, wind }) {
    return (
        <>
            <div className="feels-like">
                <span className="label">Feels Like:</span>
                <span className="value"> {feels} °C</span>
            </div>
            <div className="humidity">
                <span className="label">Humidity:</span>
                <span className="value"> {humidity}%</span>
            </div>
            <div className="wind">
                <span className="label">Wind:</span>
                <span className="value"> {wind} m/s</span>
            </div>
        </>
    );
}

function Temps({ maxTemp, minTemp }) {
    return (
        <div className="temperature-details">
            <MaxTemp maxTemp={maxTemp} />
            <MinTemp minTemp={minTemp} />
        </div>
    );
}

function MaxTemp({ maxTemp }) {
    return (
        <div className="max-temp">
            <span className="label">Max temperature:</span>
            <span className="value"> {maxTemp} °C</span>
        </div>
    );
}

function MinTemp({ minTemp }) {
    return (
        <div className="min-temp">
            <span className="label">Min temperature:</span>
            <span className="value"> {minTemp} °C</span>
        </div>
    );
}

function Search({ query, setQuery }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search Location ..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
        </div>
    );
}

function Location({ resolvedAddress }) {
    return (
        <div className="location">
            <p>Location: {resolvedAddress ? resolvedAddress : 'Unknown'}</p>
        </div>
    );
}

function Section({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}
