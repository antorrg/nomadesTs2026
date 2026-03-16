import React from "react";
import ErrorScreen from "./ErrorScreen";

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  State
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("UI Error caught by boundary:", error, info);
    // aquí podrías enviar logs a Sentry, DB, etc.
  }

  render() {
    if (this.state.hasError) {
      return( 
        <ErrorScreen/>
      );
    }
    return this.props.children;
  }
}
