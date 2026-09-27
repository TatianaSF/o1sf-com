# State boundary

The engine currently defines a serializable `GameSessionState` and returns new state objects for every transition. Runs stay in client memory. Future persistence adapters belong here and must keep state independent from UI components so runs can later be stored through the AI Future Sim Worker.
