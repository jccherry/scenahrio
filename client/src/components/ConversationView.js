import React, { useEffect } from 'react'

function ConversationView({
    scenario_id
}) {
    const [scenario, setScenario] = useState({});

    const retrieveScenarioContent = async (scenarioId) => {
        fetch('/get_scenario_content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ scenario_id: scenario_id }),
          }).then(response => response.json())
            .then(scenario=> {
                console.log(scenario); 
                setScenario(scenario.scenario);
            });
    }

    useEffect(() => {
        retrieveScenarioContent();
    }, [])

    return (
        <div className='conversationView'>
            {scenario}
        </div>
    )
}

export default ConversationView
