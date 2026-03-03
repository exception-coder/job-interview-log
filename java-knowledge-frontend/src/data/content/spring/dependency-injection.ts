import type { KnowledgeBlockContent } from '../../types'

/**
 * 依赖注入 - 详细内容
 */
export const dependencyInjectionContent: KnowledgeBlockContent = {
  id: 'dependency-injection',
  title: '依赖注入',
  description: `**依赖注入（Dependency Injection, DI）**

**三种注入方式**

**1. 构造器注入（推荐）**
- 通过构造函数注入依赖
- 优点：
  - 依赖明确，强制注入
  - 支持final字段，保证不可变性
  - 便于单元测试
  - 避免循环依赖
- 缺点：参数过多时代码冗长

**2. Setter注入**
- 通过setter方法注入依赖
- 优点：
  - 灵活，可选依赖
  - 可以重新注入
- 缺点：
  - 依赖可能为null
  - 不支持final字段

**3. 字段注入（不推荐）**
- 通过@Autowired直接注入字段
- 优点：代码简洁
- 缺点：
  - 违反封装性
  - 难以单元测试
  - 隐藏依赖关系
  - 容易产生循环依赖

**注入注解**
- @Autowired：Spring注解，按类型注入
- @Resource：JSR-250注解，按名称注入
- @Inject：JSR-330注解，按类型注入
- @Qualifier：指定Bean名称
- @Primary：设置首选Bean`,
  
  code: `// 1. 构造器注入（推荐）
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // 构造器注入
    // Spring 4.3+单个构造器可省略@Autowired
    public UserService(UserRepository userRepository, 
                      EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}

// 2. Setter注入
@Service
public class OrderService {
    private PaymentService paymentService;
    private NotificationService notificationService;
    
    // Setter注入
    @Autowired
    public void setPaymentService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @Autowired
    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}

// 3. 字段注入（不推荐）
@Service
public class ProductService {
    // 字段注入
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CacheService cacheService;
    
    // 问题：难以进行单元测试，无法使用final
}

// 4. @Autowired按类型注入
@Service
public class ShoppingCartService {
    private final DiscountService discountService;
    
    @Autowired
    public ShoppingCartService(DiscountService discountService) {
        this.discountService = discountService;
    }
}

// 5. @Qualifier指定Bean名称
@Service
public class PaymentService {
    private final PaymentGateway paymentGateway;
    
    @Autowired
    public PaymentService(@Qualifier("alipayGateway") 
                         PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}

@Component("alipayGateway")
public class AlipayGateway implements PaymentGateway {
    // 支付宝支付实现
}

@Component("wechatGateway")
public class WechatGateway implements PaymentGateway {
    // 微信支付实现
}

// 6. @Primary设置首选Bean
@Primary
@Component
public class DefaultPaymentGateway implements PaymentGateway {
    // 默认支付实现
}

@Service
public class CheckoutService {
    private final PaymentGateway paymentGateway;
    
    // 自动注入@Primary标记的Bean
    @Autowired
    public CheckoutService(PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}

// 7. @Resource按名称注入
@Service
public class ReportService {
    @Resource(name = "userRepository")
    private UserRepository userRepository;
    
    @Resource
    private EmailService emailService; // 按字段名查找Bean
}

// 8. 可选依赖
@Service
public class LogService {
    private final Logger logger;
    
    // required=false表示可选依赖
    @Autowired(required = false)
    public LogService(Logger logger) {
        this.logger = logger != null ? logger : new DefaultLogger();
    }
}

// 使用Optional
@Service
public class CacheService {
    private final RedisTemplate redisTemplate;
    
    @Autowired
    public CacheService(Optional<RedisTemplate> redisTemplate) {
        this.redisTemplate = redisTemplate.orElse(null);
    }
}

// 9. 注入集合
@Service
public class NotificationService {
    private final List<MessageSender> messageSenders;
    
    // 注入所有MessageSender类型的Bean
    @Autowired
    public NotificationService(List<MessageSender> messageSenders) {
        this.messageSenders = messageSenders;
    }
    
    public void sendNotification(String message) {
        messageSenders.forEach(sender -> sender.send(message));
    }
}

// 10. 注入Map
@Service
public class PaymentFactory {
    private final Map<String, PaymentGateway> paymentGateways;
    
    // Key是Bean名称，Value是Bean实例
    @Autowired
    public PaymentFactory(Map<String, PaymentGateway> paymentGateways) {
        this.paymentGateways = paymentGateways;
    }
    
    public PaymentGateway getGateway(String type) {
        return paymentGateways.get(type + "Gateway");
    }
}

// 11. 构造器注入 vs 字段注入对比
// 字段注入的问题
@Service
public class BadService {
    @Autowired
    private DependencyA dependencyA;
    
    @Autowired
    private DependencyB dependencyB;
    
    // 单元测试困难
    // 无法使用final
    // 隐藏依赖
}

// 构造器注入的优势
@Service
public class GoodService {
    private final DependencyA dependencyA;
    private final DependencyB dependencyB;
    
    public GoodService(DependencyA dependencyA, 
                      DependencyB dependencyB) {
        this.dependencyA = dependencyA;
        this.dependencyB = dependencyB;
    }
    
    // 单元测试简单
    // 支持final
    // 依赖明确
}

// 单元测试示例
public class GoodServiceTest {
    @Test
    public void testService() {
        // 构造器注入便于测试
        DependencyA mockA = mock(DependencyA.class);
        DependencyB mockB = mock(DependencyB.class);
        
        GoodService service = new GoodService(mockA, mockB);
        // 测试代码...
    }
}`
}

