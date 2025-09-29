import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

function App() {
  const handleClick = (variant) => {
    alert(`Clicked ${variant} button!`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-background-lighter p-8 rounded-lg border border-border-light">
          <h2 className="text-3xl font-bold text-text-secondary mb-4">
            Chào mừng đến với FundFountain
          </h2>
          <p className="text-text-secondary mb-6">
            Đây là ứng dụng demo với hệ thống màu sắc và Button component có thể
            tái sử dụng.
          </p>
        </div>

        {/* Header Variants Demo */}
        <div className="bg-background-light p-8 rounded-lg border border-border-light">
          <h3 className="text-2xl font-semibold text-text-primary mb-6">
            Header Variants Demo
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">
                Light Header (Default):
              </h4>
              <Header variant="light" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">
                Primary Header (Green background):
              </h4>
              <Header variant="primary" />
            </div>
          </div>
        </div>

        {/* Button Variants Demo */}
        <div className="bg-white p-8 rounded-lg border border-border-light">
          <h3 className="text-2xl font-semibold text-text-primary mb-6">
            Button Variants Demo
          </h3>

          {/* Primary & Secondary Buttons */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-3">
              Solid Buttons:
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => handleClick('primary')}>
                Primary Button
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleClick('secondary')}
              >
                Secondary Button
              </Button>
              <Button variant="white" onClick={() => handleClick('white')}>
                White Button
              </Button>
              <Button variant="light" onClick={() => handleClick('light')}>
                Light Button
              </Button>
              <Button variant="danger" onClick={() => handleClick('danger')}>
                Danger Button
              </Button>
            </div>
          </div>

          {/* Outline Buttons */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-3">
              Outline Buttons:
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => handleClick('outline')}>
                Outline Primary
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleClick('outline-secondary')}
              >
                Outline Secondary
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleClick('outline-danger')}
              >
                Outline Danger
              </Button>
              <Button variant="ghost" onClick={() => handleClick('ghost')}>
                Ghost Button
              </Button>
            </div>
          </div>

          {/* Different Sizes */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-3">
              Button Sizes:
            </h4>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleClick('small')}
              >
                Small
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleClick('medium')}
              >
                Medium
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleClick('large')}
              >
                Large
              </Button>
              <Button
                variant="primary"
                size="xl"
                onClick={() => handleClick('extra-large')}
              >
                Extra Large
              </Button>
            </div>
          </div>

          {/* Button States */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-text-primary mb-3">
              Button States:
            </h4>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Normal Button</Button>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
              <Button variant="primary" loading>
                Loading Button
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
