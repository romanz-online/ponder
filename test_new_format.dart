// Test file for new ponder format

/// @ponder
/// @preview https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW90enVzYmhzNjhwemJ4eWhqbjAycGZ5eDZna2wxcGwxODBjMzJtdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jz2VNqCrlFsPe/giphy.gif
/// @detailed https://example.com/detailed-demo
class TestWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

/// @ponder
/// @preview https://example.com/preview.gif
class AnotherWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

/// @ponder
/// @detailed https://example.com/only-detailed
class DetailedOnlyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

/// @ponder
/// @preview assets/images/Logo.svg
class LocalFileWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}